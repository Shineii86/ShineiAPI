'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function SeriesError({ error, reset }) {
  useEffect(() => { console.error('[ShineiAPI Series]', error); }, [error]);

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold uppercase font-display text-primary mb-3">Series Not Found</h1>
        <p className="text-gray-500 mb-8">The series couldn&apos;t be loaded. It may have been removed or the API is temporarily unavailable.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-brutal">Try Again</button>
          <Link href="/browse" className="btn-brutal-outline">Back to Browse</Link>
        </div>
      </div>
    </main>
  );
}
