/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Docs Loading State                                  ║
 * ╚══════════════════════════════════════════════════════╝
 */

export default function DocsLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="pt-20 flex">
        {/* Sidebar skeleton */}
        <aside className="fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] p-5 hidden lg:block bg-surface-bright/50"
          style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="space-y-7">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-3 w-20 bg-primary/10 mb-3 rounded" style={{ borderRadius: 4 }} />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="h-4 bg-primary/5 rounded" style={{ borderRadius: 6 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content skeleton */}
        <main className="flex-1 lg:ml-64 p-6 md:p-10 max-w-containerWidth">
          <div className="mb-16 pt-4">
            <div className="h-8 w-24 bg-primary/10 mb-6" style={{ borderRadius: 8 }} />
            <div className="h-12 w-3/4 bg-primary/10 mb-4" style={{ borderRadius: 8 }} />
            <div className="h-4 w-full bg-primary/5 mb-2" style={{ borderRadius: 4 }} />
            <div className="h-4 w-2/3 bg-primary/5" style={{ borderRadius: 4 }} />
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-6 w-40 bg-primary/10 mb-4" style={{ borderRadius: 6 }} />
                <div className="h-32 bg-primary/5" style={{ borderRadius: 12 }} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
