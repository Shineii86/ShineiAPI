/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Root Loading State                                  ║
 * ╚══════════════════════════════════════════════════════╝
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-accent animate-spin mx-auto mb-6" />
        <p className="font-display font-bold uppercase tracking-wider text-primary text-sm">
          Loading...
        </p>
      </div>
    </div>
  );
}
