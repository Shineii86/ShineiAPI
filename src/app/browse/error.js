'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Browse Error Boundary                               ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function BrowseError({ error, reset }) {
  useEffect(() => {
    console.error('[ShineiAPI Browse]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold uppercase font-display text-primary mb-3">
          Failed to Load Browse
        </h1>
        <p className="text-gray-500 mb-8">
          Something went wrong while loading the browse page. The API might be temporarily unavailable.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={reset} className="btn-brutal">
            Try Again
          </button>
          <Link href="/" className="btn-brutal-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
