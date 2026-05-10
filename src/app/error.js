'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Root Error Boundary                                 ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[ShineiAPI]', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <div className="text-center max-w-lg">
        <div className="text-6xl font-bold font-display text-secondary mb-4 uppercase">
          Error
        </div>
        <h1 className="text-2xl font-bold uppercase font-display mb-4">
          Something Went Wrong
        </h1>
        <div className="border-l-8 border-secondary pl-6 mb-8 text-left inline-block">
          <p className="text-gray-600 leading-relaxed">
            An unexpected error occurred. This has been logged and we&apos;re looking into it.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={reset}
            className="btn-brutal"
          >
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
