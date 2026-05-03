'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch, IconArrowRight } from '@/components/icons';

const allItems = [
  { label: 'Browse Series', href: '/docs#browse', section: 'Endpoints' },
  { label: 'Series Detail', href: '/docs#series', section: 'Endpoints' },
  { label: 'Chapter List', href: '/docs#chapters', section: 'Endpoints' },
  { label: 'Search', href: '/docs#search', section: 'Endpoints' },
  { label: 'Popular & Trending', href: '/docs#popular', section: 'Endpoints' },
  { label: 'Random Series', href: '/docs#random', section: 'Endpoints' },
  { label: 'Top Rated', href: '/docs#top', section: 'Endpoints' },
  { label: 'Release Schedule', href: '/docs#schedule', section: 'Endpoints' },
  { label: 'Genres', href: '/docs#genres', section: 'Endpoints' },
  { label: 'Health Check', href: '/docs#health', section: 'Reference' },
  { label: 'API Stats', href: '/docs#stats', section: 'Reference' },
  { label: 'Rate Limiting', href: '/docs#rate-limiting', section: 'Reference' },
  { label: 'Caching', href: '/docs#caching', section: 'Reference' },
  { label: 'Error Codes', href: '/docs#errors', section: 'Reference' },
  { label: 'Quick Start', href: '/docs#quickstart', section: 'Getting Started' },
  { label: 'Base URL', href: '/docs#base-url', section: 'Getting Started' },
  { label: 'Response Format', href: '/docs#response-format', section: 'Getting Started' },
  { label: 'Try It Out', href: '/docs#try-it', section: 'Getting Started' },
  { label: 'FAQ', href: '/docs#faq', section: 'Reference' },
];

export default function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  const filtered = query.trim()
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) { inputRef.current.focus(); setSelected(0); }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const navigate = (href) => { setOpen(false); router.push(href); };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) navigate(filtered[selected].href);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-primary bg-surface-dim hover:bg-accent/30 border-4 border-primary transition-all font-bold min-h-[44px]"
      >
        <IconSearch size={14} />
        <span className="hidden sm:inline uppercase tracking-wider text-xs">Search</span>
        <kbd className="hidden sm:inline text-[10px] font-mono text-gray-400 bg-primary text-white px-1.5 py-0.5 ml-1">⌘K</kbd>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="relative w-full max-w-lg mx-4 bg-surface border-4 border-primary shadow-brutal-lg overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b-4 border-primary bg-surface-dim">
              <IconSearch size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search endpoints, features..."
                className="flex-1 bg-transparent text-primary text-sm placeholder:text-gray-400 outline-none font-medium"
              />
              <kbd className="text-[10px] font-mono text-white bg-primary px-1.5 py-0.5">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400 font-bold uppercase">No results found</div>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === selected ? 'bg-accent text-primary' : 'text-gray-600 hover:bg-accent/20'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{item.label}</div>
                      <div className="text-[11px] text-gray-400 uppercase tracking-wider">{item.section}</div>
                    </div>
                    <IconArrowRight size={14} className="text-gray-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
