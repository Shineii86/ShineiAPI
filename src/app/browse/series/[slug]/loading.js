export default function SeriesLoading() {
  return (
    <main className="min-h-screen bg-surface">
      <nav className="fixed top-0 w-full z-50 nav-frosted-solid">
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary/10 animate-pulse rounded-lg" />
            <div className="h-5 w-24 bg-primary/10 animate-pulse rounded" />
          </div>
        </div>
      </nav>

      <div className="pt-20 sm:pt-24 pb-16">
        {/* Back link skeleton */}
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 mb-6">
          <div className="h-4 w-28 bg-primary/5 animate-pulse rounded" />
        </div>

        {/* Banner skeleton */}
        <div className="h-56 sm:h-72 md:h-80 bg-primary/5 animate-pulse" />

        {/* Content skeleton */}
        <div className="relative max-w-containerWidth mx-auto px-4 sm:px-6 -mt-32 sm:-mt-36">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
            {/* Cover skeleton */}
            <div className="w-40 sm:w-52 shrink-0 mx-auto sm:mx-0">
              <div className="aspect-[3/4] bg-primary/10 animate-pulse rounded-2xl border-4 border-surface" />
            </div>
            {/* Info skeleton */}
            <div className="flex-1 pt-4 sm:pt-12 space-y-4">
              <div className="h-10 w-3/4 bg-primary/10 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-primary/5 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-7 w-16 bg-primary/5 animate-pulse rounded-lg" />
                <div className="h-7 w-20 bg-primary/5 animate-pulse rounded-lg" />
                <div className="h-7 w-14 bg-primary/5 animate-pulse rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-primary/5 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-primary/5 animate-pulse rounded" />
                <div className="h-4 w-4/6 bg-primary/5 animate-pulse rounded" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-3 bg-primary/5 animate-pulse rounded-xl">
                    <div className="h-3 w-16 bg-primary/10 rounded mb-1" />
                    <div className="h-6 w-12 bg-primary/10 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters skeleton */}
          <div className="mt-10">
            <div className="h-5 w-32 bg-primary/10 animate-pulse rounded mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-primary/5 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
