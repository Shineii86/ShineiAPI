'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GenresError({ error, reset }) {
  useEffect(() => { console.error('[ShineiAPI Genres]', error); }, [error]);

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-4xl font-bold font-display text-secondary mb-4 uppercase">Error</div>
        <h1 className="text-xl font-bold uppercase font-display mb-4">Failed to Load Genres</h1>
        <p className="text-gray-500 mb-8 text-sm">The genre list couldn&apos;t be loaded. Please try again.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-brutal !text-sm">Try Again</button>
          <Link href="/browse" className="btn-brutal-outline !text-sm">Back to Browse</Link>
        </div>
      </div>
    </main>
  );
}
