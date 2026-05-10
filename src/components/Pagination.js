'use client';

import { IconArrowLeft, IconArrowRight } from '@/components/icons';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  Pagination — Numbered page navigation               ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * @param {number} currentPage - Current active page
 * @param {number} totalItems - Total number of items
 * @param {number} perPage - Items per page (default 25)
 * @param {function} onPageChange - Callback when page changes
 * @param {string} [className] - Additional CSS classes
 */

export default function Pagination({ currentPage, totalItems, perPage = 25, onPageChange, className = '' }) {
  const totalPages = Math.ceil(totalItems / perPage);
  if (totalPages <= 1) return null;

  /* Generate page numbers with ellipsis */
  const pages = [];
  const delta = 1; // Pages around current
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-primary/10 text-primary/60 hover:bg-accent/20 hover:border-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-primary/10"
        aria-label="Previous page"
      >
        <IconArrowLeft size={14} />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-xs text-gray-400 font-mono">
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-lg border-2 transition-all ${
              p === currentPage
                ? 'bg-primary text-white border-primary shadow-brutal-sm'
                : 'border-primary/10 text-primary/60 hover:bg-accent/20 hover:border-primary/20'
            }`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-primary/10 text-primary/60 hover:bg-accent/20 hover:border-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-primary/10"
        aria-label="Next page"
      >
        <IconArrowRight size={14} />
      </button>

      {/* Info */}
      <span className="ml-3 text-[11px] text-gray-400 font-mono hidden sm:inline">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
