export default function GenresLoading() {
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
      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto">
          <div className="mb-10">
            <div className="h-4 w-24 bg-primary/5 animate-pulse rounded mb-4" />
            <div className="h-10 w-64 bg-primary/10 animate-pulse rounded mb-3" />
            <div className="h-4 w-80 bg-primary/5 animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-24 bg-primary/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
