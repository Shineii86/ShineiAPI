import Link from 'next/link';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Custom 404 Page — Neo-Brutalist                     ║
 * ╚══════════════════════════════════════════════════════╝
 */

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <div className="text-center max-w-lg">
        <div className="text-[8rem] md:text-[10rem] font-bold font-display text-secondary leading-none mb-4 select-none uppercase">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold uppercase font-display mb-4">
          Page Not Found
        </h1>
        <div className="border-l-8 border-primary pl-6 mb-8 text-left inline-block">
          <p className="text-gray-600 text-lg leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/" className="btn-brutal">
            Back to Home
          </Link>
          <Link href="/docs" className="btn-brutal-outline">
            View Docs
          </Link>
        </div>
      </div>
    </main>
  );
}
