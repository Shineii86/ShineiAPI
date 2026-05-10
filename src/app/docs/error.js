'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Docs Error Boundary                                 ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function DocsError({ error, reset }) {
  useEffect(() => {
    console.error('[ShineiAPI Docs]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-4xl font-bold font-display text-secondary mb-4 uppercase">
          Error
        </div>
        <h1 className="text-xl font-bold uppercase font-display mb-4">
          Failed to Load Docs
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Something went wrong while loading the documentation.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-brutal !py-2 !px-4 !text-xs">
            Try Again
          </button>
          <Link href="/" className="btn-brutal-outline !py-2 !px-4 !text-xs">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
