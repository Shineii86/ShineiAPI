/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Browse Loading Skeleton                             ║
 * ╚══════════════════════════════════════════════════════╝
 */

function CardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] w-full bg-primary/5 animate-pulse rounded-2xl" />
      <div className="h-4 w-3/4 bg-primary/5 animate-pulse rounded" />
      <div className="h-3 w-1/2 bg-primary/5 animate-pulse rounded" />
    </div>
  );
}

export default function BrowseLoading() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Nav skeleton */}
      <nav className="fixed top-0 w-full z-50 nav-frosted-solid">
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary/10 animate-pulse rounded-lg" />
            <div className="h-5 w-24 bg-primary/10 animate-pulse rounded" />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-16 bg-primary/5 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto">
          {/* Featured banner skeleton */}
          <div className="h-64 sm:h-80 md:h-96 bg-primary/5 animate-pulse rounded-3xl mb-8" />

          {/* Search bar skeleton */}
          <div className="h-14 max-w-2xl mx-auto bg-primary/5 animate-pulse rounded-2xl mb-6" />

          {/* Genre pills skeleton */}
          <div className="flex justify-center gap-2 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-8 w-16 bg-primary/5 animate-pulse rounded-lg" />
            ))}
          </div>

          {/* Section header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-primary/5 animate-pulse rounded-xl" />
            <div>
              <div className="h-5 w-32 bg-primary/10 animate-pulse rounded mb-1" />
              <div className="h-3 w-48 bg-primary/5 animate-pulse rounded" />
            </div>
          </div>

          {/* Card grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
