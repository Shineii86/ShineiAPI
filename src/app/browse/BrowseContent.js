'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Browse Content — Live Manhwa Website Showcase       ║
 * ║  Powered by ShineiAPI                                ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  IconSearch, IconStarFilled, IconBook, IconArrowRight,
  IconArrowLeft, IconX, IconClock, IconChevronRight,
  IconGithub, IconHeart, IconTag, IconShuffle, IconTrophy,
  IconChevronDown, IconCode,
} from '@/components/icons';
import Pagination from '@/components/Pagination';

/* ═══════════════════════════════════════════════════════
   API Helpers
   ═══════════════════════════════════════════════════════ */

const API = '/api/v1';

function formatRating(r) {
  if (!r && r !== 0) return null;
  const n = parseFloat(r);
  if (isNaN(n)) return r;
  return n.toFixed(1);
}

async function fetchJSON(endpoint) {
  const res = await fetch(`${API}${endpoint}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'API error');
  return json.data;
}

/* ═══════════════════════════════════════════════════════
   Skeleton Loader
   ═══════════════════════════════════════════════════════ */

function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-primary/5 rounded-2xl ${className}`} />
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Cover Image — with fallback
   ═══════════════════════════════════════════════════════ */

function CoverImage({ src, alt, className = '', aspect = 'aspect-[3/4]', sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const url = src?.large || src?.small || src;

  return (
    <div className={`relative overflow-hidden bg-primary/5 ${aspect} ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-primary/5" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
          <IconBook size={32} className="text-primary/20" />
        </div>
      ) : (
        <img
          src={url}
          alt={alt}
          sizes={sizes}
          className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Series Card
   ═══════════════════════════════════════════════════════ */

function SeriesCard({ series, onClick, index = 0 }) {
  return (
    <button
      onClick={() => onClick(series)}
      className="group text-left w-full transition-all duration-300 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary/50 rounded-2xl"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative rounded-2xl overflow-hidden border border-primary/8 shadow-sm group-hover:shadow-brutal-lg group-hover:border-primary/15 transition-all duration-300">
        <CoverImage src={series.cover} alt={series.title} />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Rating badge */}
        {series.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-lg border border-white/10">
            <IconStarFilled size={11} className="text-yellow-400" />
            {formatRating(series.rating)}
          </div>
        )}
        {/* Bottom info on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-semibold uppercase tracking-wider">{series.type}</p>
          {series.chapters_count && (
            <p className="text-white/70 text-[11px] mt-0.5">{series.chapters_count} chapters</p>
          )}
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-bold text-primary line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
          {series.title}
        </h3>
        {series.genres?.length > 0 && (
          <p className="text-[11px] text-gray-500 mt-1 font-medium truncate">
            {series.genres.slice(0, 3).map(g => g.name || g).join(' · ')}
          </p>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   Horizontal Scroll Row
   ═══════════════════════════════════════════════════════ */

function ScrollRow({ children, className = '' }) {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, children]);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <div className={`relative group/row ${className}`}>
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-surface-bright/90 backdrop-blur-md border border-primary/10 rounded-full shadow-brutal text-primary hover:bg-accent hover:text-primary transition-all opacity-0 group-hover/row:opacity-100 -translate-x-2 group-hover/row:translate-x-0"
          aria-label="Scroll left"
        >
          <IconArrowLeft size={18} />
        </button>
      )}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-surface-bright/90 backdrop-blur-md border border-primary/10 rounded-full shadow-brutal text-primary hover:bg-accent hover:text-primary transition-all opacity-0 group-hover/row:opacity-100 translate-x-2 group-hover/row:translate-x-0"
          aria-label="Scroll right"
        >
          <IconArrowRight size={18} />
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Section Header
   ═══════════════════════════════════════════════════════ */

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-6 gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 bg-accent/20 flex items-center justify-center text-primary rounded-xl">
            <Icon size={17} />
          </div>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-bold uppercase font-display tracking-tight text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Series Detail Modal
   ═══════════════════════════════════════════════════════ */

function SeriesDetail({ slug, onClose }) {
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchJSON(`/series/${slug}?include=chapters`)
      .then(setSeries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const chapters = series?.chapters || [];
  const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 30);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-3xl bg-surface rounded-3xl shadow-2xl border border-primary/8 overflow-hidden animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors border border-white/10"
          aria-label="Close"
        >
          <IconX size={20} />
        </button>

        {loading ? (
          <div className="p-8 space-y-6">
            <div className="flex gap-6">
              <Skeleton className="w-48 aspect-[3/4] rounded-2xl shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconX size={28} className="text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Failed to load</h3>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button onClick={onClose} className="btn-brutal-outline !text-xs">Go Back</button>
          </div>
        ) : series && (
          <>
            {/* Banner */}
            <div className="relative h-48 sm:h-64 bg-primary overflow-hidden">
              {series.banner ? (
                <img src={series.banner} alt="" className="w-full h-full object-cover opacity-40" />
              ) : series.cover ? (
                <img src={series.cover?.large || series.cover?.small || series.cover} alt="" className="w-full h-full object-cover opacity-20 blur-xl scale-110" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative px-6 sm:px-8 -mt-24 pb-8">
              <div className="flex gap-5 sm:gap-6">
                {/* Cover */}
                <div className="w-32 sm:w-44 shrink-0">
                  <div className="rounded-2xl overflow-hidden border-4 border-surface shadow-brutal-lg">
                    <CoverImage src={series.cover} alt={series.title} aspect="aspect-[3/4]" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 pt-16 sm:pt-20 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-primary leading-tight">
                    {series.title}
                  </h1>
                  {series.alt_titles?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1 font-medium truncate">
                      {series.alt_titles[0]}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {series.rating && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/20 text-primary text-xs font-bold rounded-lg">
                        <IconStarFilled size={12} className="text-yellow-500" />
                        {formatRating(series.rating)}
                      </span>
                    )}
                    {series.status && (
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg border ${
                        series.status === 'Completed' ? 'bg-green-500/10 text-green-700 border-green-500/20' :
                        series.status === 'Releasing' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {series.status}
                      </span>
                    )}
                    {series.type && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-primary/5 text-primary/70 text-xs font-bold rounded-lg border border-primary/10">
                        {series.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              {series.synopsis && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Synopsis</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{series.synopsis}</p>
                </div>
              )}

              {/* Metadata grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {series.chapters_count && (
                  <div className="p-3 bg-primary/5 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Chapters</p>
                    <p className="text-lg font-bold font-display text-primary mt-0.5">{series.chapters_count}</p>
                  </div>
                )}
                {series.bookmarks_count && (
                  <div className="p-3 bg-primary/5 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Bookmarks</p>
                    <p className="text-lg font-bold font-display text-primary mt-0.5">{series.bookmarks_count.toLocaleString()}</p>
                  </div>
                )}
                {series.rating_count && (
                  <div className="p-3 bg-primary/5 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Ratings</p>
                    <p className="text-lg font-bold font-display text-primary mt-0.5">{series.rating_count.toLocaleString()}</p>
                  </div>
                )}
                {series.popularity_rank && (
                  <div className="p-3 bg-primary/5 rounded-xl">
                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Rank</p>
                    <p className="text-lg font-bold font-display text-primary mt-0.5">#{series.popularity_rank}</p>
                  </div>
                )}
              </div>

              {/* Genres */}
              {series.genres?.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {series.genres.map((g, i) => (
                      <span key={i} className="px-3 py-1.5 bg-accent/15 text-primary text-xs font-bold rounded-lg border border-primary/8">
                        {g.name || g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Authors & Artists */}
              {(series.authors?.length > 0 || series.artists?.length > 0) && (
                <div className="mt-5 flex flex-wrap gap-6">
                  {series.authors?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Authors</h3>
                      <p className="text-sm text-primary font-semibold">{series.authors.map(a => a.name || a).join(', ')}</p>
                    </div>
                  )}
                  {series.artists?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Artists</h3>
                      <p className="text-sm text-primary font-semibold">{series.artists.map(a => a.name || a).join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Chapters */}
              {chapters.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Chapters ({chapters.length})
                    </h3>
                    {chapters.length > 30 && (
                      <button
                        onClick={() => setShowAllChapters(!showAllChapters)}
                        className="text-xs font-bold text-tertiary hover:text-tertiary/80 transition-colors flex items-center gap-1"
                      >
                        {showAllChapters ? 'Show Less' : `Show All ${chapters.length}`}
                        <IconChevronDown size={14} className={`transition-transform ${showAllChapters ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {visibleChapters.map((ch, i) => (
                      <div
                        key={ch.id || i}
                        className="flex items-center justify-between px-4 py-3 bg-primary/[0.02] hover:bg-primary/5 rounded-xl transition-colors group/ch"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-mono text-gray-400 w-8 text-right shrink-0">
                            {ch.order || `#${i + 1}`}
                          </span>
                          <span className="text-sm font-semibold text-primary truncate">
                            {ch.title || `Chapter ${ch.order || i + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          {ch.sources?.length > 0 && ch.sources[0]?.url && (
                            <a
                              href={ch.sources[0].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-tertiary hover:text-tertiary/80 bg-tertiary/8 hover:bg-tertiary/15 px-2 py-1 rounded transition-colors"
                            >
                              Read
                            </a>
                          )}
                          {ch.published_at && (
                            <span className="text-[11px] text-gray-400 font-medium">
                              {new Date(ch.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Sources */}
              {series.official_sources?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Official Sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {series.official_sources.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-lg border border-primary/8 hover:bg-accent/20 transition-colors"
                      >
                        {s.name}
                        {s.type && <span className="text-gray-400">({s.type})</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Browse Content
   ═══════════════════════════════════════════════════════ */

export default function BrowseContent() {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [featured, setFeatured] = useState(null);

  const [popPage, setPopPage] = useState(1);
  const [trendPage, setTrendPage] = useState(1);
  const [popLoading, setPopLoading] = useState(false);
  const [trendLoading, setTrendLoading] = useState(false);
  const [popTotal, setPopTotal] = useState(0);
  const [trendTotal, setTrendTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotal, setSearchTotal] = useState(0);

  const [selectedSeries, setSelectedSeries] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);

  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);

  /* ─── Autocomplete suggestions ─── */
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimerRef = useRef(null);

  /* Debounced autocomplete — fires 300ms after user stops typing */
  useEffect(() => {
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    suggestTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery.trim())}&page=1`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setSuggestions(json.data.slice(0, 6));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(suggestTimerRef.current);
  }, [searchQuery]);

  /* ─── Initial data load ─── */
  useEffect(() => {
    async function load() {
      try {
        const [popData, trendData, topData, genreData] = await Promise.all([
          fetchJSON('/popular').catch(() => []),
          fetchJSON('/popular?type=trending').catch(() => []),
          fetchJSON('/top').catch(() => []),
          fetchJSON('/genres').catch(() => []),
        ]);
        setPopular(popData);
        setTrending(trendData);
        setTopRated(topData);
        setGenres(genreData);
        // Pick a random featured series from popular
        if (popData.length > 0) {
          setFeatured(popData[Math.floor(Math.random() * Math.min(popData.length, 5))]);
        }
      } catch (e) {
        console.error('Failed to load browse data:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ─── Search with debounce ─── */
  const triggerSearch = useCallback(async (page = 1) => {
    const query = searchQuery;
    if (!query || query.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);

    try {
      const params = new URLSearchParams({ q: query.trim(), page: String(page) });
      if (activeGenre) params.append('genre', activeGenre);
      const res = await fetch(`/api/v1/search?${params}`);
      const json = await res.json();
      if (json.success) {
        setSearchResults(json.data);
        setSearchTotal(json.pagination?.total || json.data.length);
        setSearchPage(page);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, activeGenre]);

  /* ─── Genre filter ─── */
  const handleGenreClick = useCallback((slug) => {
    setActiveGenre(prev => prev === slug ? null : slug);
    if (searchQuery) {
      triggerSearch(1);
    }
  }, [searchQuery, triggerSearch]);

  /* ─── Load more for Popular ─── */
  const loadMorePopular = useCallback(async () => {
    setPopLoading(true);
    try {
      const nextPage = popPage + 1;
      const res = await fetch(`/api/v1/popular?page=${nextPage}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setPopular(prev => [...prev, ...json.data]);
        setPopPage(nextPage);
        setPopTotal(json.pagination?.total || 0);
      }
    } catch {}
    finally { setPopLoading(false); }
  }, [popPage]);

  /* ─── Load more for Trending ─── */
  const loadMoreTrending = useCallback(async () => {
    setTrendLoading(true);
    try {
      const nextPage = trendPage + 1;
      const res = await fetch(`/api/v1/popular?type=trending&page=${nextPage}`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setTrending(prev => [...prev, ...json.data]);
        setTrendPage(nextPage);
        setTrendTotal(json.pagination?.total || 0);
      }
    } catch {}
    finally { setTrendLoading(false); }
  }, [trendPage]);

  const isSearching = searchQuery.length >= 2;

  return (
    <main className="min-h-screen bg-surface">
      {/* ═══════════════════════════════════════════════════
          NAV
          ═══════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 nav-frosted-solid">
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-bold text-sm" style={{ borderRadius: 10, fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", "SimSun", serif' }}>
              水
            </div>
            <span className="text-lg font-bold font-display uppercase tracking-tight">ShineiAPI</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/browse" className="text-sm font-semibold text-primary bg-accent/80 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Browse</Link>
            <Link href="/browse/genres" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Genres</Link>
            <Link href="/docs" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Docs</Link>
            <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
              <IconGithub size={15} /> GitHub
            </a>
            <Link href="/" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════
          HERO / SEARCH BAR
          ═══════════════════════════════════════════════════ */}
      <section className="pt-20 sm:pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto">
          {/* Featured Banner */}
          {featured && !isSearching && (
            <div className="relative rounded-3xl overflow-hidden mb-8 h-64 sm:h-80 md:h-96 group">
              {featured.cover && (
                <img
                  src={featured.cover?.large || featured.cover?.small || featured.cover}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider rounded-md">Featured</span>
                  {featured.rating && (
                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-md flex items-center gap-1 border border-white/10">
                      <IconStarFilled size={10} className="text-yellow-400" /> {formatRating(featured.rating)}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display uppercase text-white tracking-tight leading-tight max-w-lg">
                  {featured.title}
                </h2>
                {featured.synopsis && (
                  <p className="text-white/70 text-sm max-w-md mt-3 line-clamp-2 leading-relaxed">
                    {featured.synopsis}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => setSelectedSeries(featured)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-yellow-300 transition-colors shadow-lg"
                  >
                    <IconBook size={16} /> Read More
                  </button>
                  {featured.genres?.length > 0 && (
                    <span className="text-white/50 text-xs font-medium hidden sm:block">
                      {featured.genres.slice(0, 3).map(g => g.name || g).join(' · ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-surface-bright border-2 border-primary/10 rounded-2xl shadow-brutal-sm focus-within:border-tertiary/40 focus-within:shadow-brutal-blue transition-all duration-200">
              <IconSearch size={18} className="absolute left-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type a manga or manhwa name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { triggerSearch(); setShowSuggestions(false); } }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-11 pr-20 py-3.5 bg-transparent text-sm font-medium text-primary placeholder-gray-400 focus:outline-none"
                autoComplete="off"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults(null); setSuggestions([]); setShowSuggestions(false); searchInputRef.current?.focus(); }}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    aria-label="Clear search"
                  >
                    <IconX size={16} />
                  </button>
                )}
                <button
                  onClick={() => { triggerSearch(); setShowSuggestions(false); }}
                  className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  aria-label="Search"
                >
                  <IconArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-bright border-2 border-primary/10 rounded-2xl shadow-brutal-lg overflow-hidden z-50 animate-fade-in">
                {suggestions.map((s, i) => (
                  <button
                    key={s.id || s.slug}
                    onMouseDown={(e) => { e.preventDefault(); setSelectedSeries(s); setShowSuggestions(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/20 transition-colors text-left border-b border-primary/5 last:border-b-0"
                  >
                    <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0 bg-primary/5">
                      {s.cover && (
                        <img src={s.cover?.small || s.cover} alt="" className="w-full h-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-primary truncate">{s.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {s.rating && (
                          <span className="text-[11px] font-bold text-yellow-600 flex items-center gap-0.5">
                            <IconStarFilled size={10} className="text-yellow-500" /> {formatRating(s.rating)}
                          </span>
                        )}
                        {s.type && <span className="text-[11px] text-gray-400">{s.type}</span>}
                        {s.chapters_count && <span className="text-[11px] text-gray-400">{s.chapters_count} ch</span>}
                      </div>
                    </div>
                    <IconChevronRight size={14} className="text-gray-300 shrink-0" />
                  </button>
                ))}
                <button
                  onMouseDown={(e) => { e.preventDefault(); triggerSearch(); setShowSuggestions(false); }}
                  className="w-full px-4 py-2.5 text-xs font-bold text-tertiary hover:bg-tertiary/10 transition-colors text-center uppercase tracking-wider"
                >
                  See all results for &quot;{searchQuery}&quot;
                </button>
              </div>
            )}
          </div>

          {/* Genre Pills */}
          {genres.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {genres.slice(0, 15).map((g) => (
                <button
                  key={g.slug}
                  onClick={() => handleGenreClick(g.slug)}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                    activeGenre === g.slug
                      ? 'bg-primary text-white border-primary shadow-brutal-sm'
                      : 'bg-surface-bright text-gray-600 border-primary/8 hover:border-primary/20 hover:bg-accent/10'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SEARCH RESULTS
          ═══════════════════════════════════════════════════ */}
      {isSearching && (
        <section className="pb-16 px-4 sm:px-6">
          <div className="max-w-containerWidth mx-auto">
            <SectionHeader
              icon={IconSearch}
              title={`Search Results`}
              subtitle={searchLoading ? 'Searching...' : `${searchTotal} result${searchTotal !== 1 ? 's' : ''} for "${searchQuery}"${activeGenre ? ` in ${activeGenre}` : ''}`}
            />
            {searchLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : searchResults?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map((s, i) => (
                    <SeriesCard key={s.id || s.slug} series={s} onClick={setSelectedSeries} index={i} />
                  ))}
                </div>
                {searchTotal > 25 && (
                  <Pagination
                    className="mt-8"
                    currentPage={searchPage}
                    totalItems={searchTotal}
                    perPage={25}
                    onPageChange={(p) => triggerSearch(p)}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IconSearch size={28} className="text-primary/20" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">No results found</h3>
                <p className="text-sm text-gray-500">Try a different search term or remove filters.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          POPULAR
          ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section className="pb-12 px-4 sm:px-6">
          <div className="max-w-containerWidth mx-auto">
            <SectionHeader
              icon={IconTrophy}
              title="Popular"
              subtitle="Most bookmarked series"
            />
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                <ScrollRow>
                  {popular.map((s, i) => (
                    <div key={s.id || s.slug} className="w-40 sm:w-44 shrink-0 snap-start">
                      <SeriesCard series={s} onClick={setSelectedSeries} index={i} />
                    </div>
                  ))}
                  {(popPage * 25 < popTotal || popular.length >= 25 * popPage) && (
                    <div className="w-40 sm:w-44 shrink-0 snap-start flex items-center justify-center">
                      <button
                        onClick={loadMorePopular}
                        disabled={popLoading}
                        className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-2 bg-primary/5 rounded-2xl border border-primary/8 hover:bg-accent/15 hover:border-primary/15 transition-all text-primary/50 hover:text-primary"
                      >
                        {popLoading ? (
                          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="text-xs font-bold uppercase tracking-wider">Load More</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </ScrollRow>
              </>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          TRENDING
          ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section className="pb-12 px-4 sm:px-6">
          <div className="max-w-containerWidth mx-auto">
            <SectionHeader
              icon={IconShuffle}
              title="Trending Now"
              subtitle="Hot this week"
            />
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <ScrollRow>
                {trending.map((s, i) => (
                  <div key={s.id || s.slug} className="w-40 sm:w-44 shrink-0 snap-start">
                    <SeriesCard series={s} onClick={setSelectedSeries} index={i} />
                  </div>
                ))}
                {(trendPage * 25 < trendTotal || trending.length >= 25 * trendPage) && (
                  <div className="w-40 sm:w-44 shrink-0 snap-start flex items-center justify-center">
                    <button
                      onClick={loadMoreTrending}
                      disabled={trendLoading}
                      className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-2 bg-primary/5 rounded-2xl border border-primary/8 hover:bg-accent/15 hover:border-primary/15 transition-all text-primary/50 hover:text-primary"
                    >
                      {trendLoading ? (
                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-wider">Load More</span>
                      )}
                    </button>
                  </div>
                )}
              </ScrollRow>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          TOP RATED
          ═══════════════════════════════════════════════════ */}
      {!isSearching && topRated.length > 0 && (
        <section className="pb-12 px-4 sm:px-6">
          <div className="max-w-containerWidth mx-auto">
            <SectionHeader
              icon={IconStarFilled}
              title="Top Rated"
              subtitle="Highest rated series of all time"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRated.slice(0, 6).map((s, i) => (
                <button
                  key={s.id || s.slug}
                  onClick={() => setSelectedSeries(s)}
                  className="group flex gap-4 p-4 bg-surface-bright border border-primary/8 rounded-2xl hover:shadow-brutal-lg hover:border-primary/15 hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-primary/5">
                    <CoverImage src={s.cover} alt={s.title} aspect="aspect-[4/5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold font-mono text-gray-400">#{i + 1}</span>
                      {s.rating && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-yellow-600">
                          <IconStarFilled size={10} className="text-yellow-500" />
                          {formatRating(s.rating)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-primary line-clamp-1 group-hover:text-secondary transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {s.chapters_count ? `${s.chapters_count} ch` : ''}
                      {s.type ? ` · ${s.type}` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          API INFO BANNER
          ═══════════════════════════════════════════════════ */}
      {!isSearching && (
        <section className="pb-16 px-4 sm:px-6">
          <div className="max-w-containerWidth mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 sm:p-10 md:p-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                  <IconCode size={12} /> Powered by ShineiAPI
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight mb-3">
                  This page is <span className="text-accent">live</span>
                </h2>
                <p className="text-white/70 text-sm max-w-md leading-relaxed mb-6">
                  Every section above fetches real data from ShineiAPI endpoints.
                  No mock data, no static content — just the API.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/docs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-300 transition-colors">
                    <IconBook size={14} /> API Docs
                  </Link>
                  <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                    <IconGithub size={14} /> Source Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-primary text-white" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent text-primary flex items-center justify-center font-bold text-sm" style={{ borderRadius: 8, fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", "SimSun", serif' }}>
                水
              </div>
              <span className="font-bold font-display uppercase tracking-tight text-accent">ShineiAPI</span>
              <span className="text-[10px] text-white/40 font-mono px-2 py-0.5" style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>v2.0.3</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">GitHub</a>
              <a href="https://github.com/Shineii86/ShineiAPI/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">License</a>
              <Link href="/terms" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Terms</Link>
              <Link href="/privacy" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Privacy</Link>
              <Link href="/support" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Support</Link>
            </div>
            <p className="text-sm text-white/40">
              Built with <IconHeart size={14} className="heartbeat" /> by <a href="https://github.com/Shineii86" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">Shinei Nouzen</a>
            </p>
          </div>
          <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-white/30">Data provided by <a href="https://toraka.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors">Toraka</a>. ShineiAPI is not affiliated with or endorsed by Toraka.</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════
          SERIES DETAIL MODAL
          ═══════════════════════════════════════════════════ */}
      {selectedSeries && (
        <SeriesDetail
          slug={selectedSeries.slug}
          onClose={() => setSelectedSeries(null)}
        />
      )}
    </main>
  );
}


