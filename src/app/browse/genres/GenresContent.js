'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Genres Content — Genre grid with series browsing    ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  IconSearch, IconTag, IconArrowLeft, IconArrowRight,
  IconBook, IconGithub, IconHeart, IconX, IconStarFilled,
} from '@/components/icons';

const API = '/api/v1';

/* ═══ Genre color map ═══ */
const GENRE_COLORS = {
  action: { bg: 'bg-red-500/10', text: 'text-red-700', border: 'border-red-500/20' },
  adventure: { bg: 'bg-orange-500/10', text: 'text-orange-700', border: 'border-orange-500/20' },
  comedy: { bg: 'bg-yellow-500/10', text: 'text-yellow-700', border: 'border-yellow-500/20' },
  drama: { bg: 'bg-purple-500/10', text: 'text-purple-700', border: 'border-purple-500/20' },
  fantasy: { bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-500/20' },
  horror: { bg: 'bg-gray-800/10', text: 'text-gray-800', border: 'border-gray-800/20' },
  romance: { bg: 'bg-pink-500/10', text: 'text-pink-700', border: 'border-pink-500/20' },
  'sci-fi': { bg: 'bg-cyan-500/10', text: 'text-cyan-700', border: 'border-cyan-500/20' },
  thriller: { bg: 'bg-slate-500/10', text: 'text-slate-700', border: 'border-slate-500/20' },
  mystery: { bg: 'bg-violet-500/10', text: 'text-violet-700', border: 'border-violet-500/20' },
  sports: { bg: 'bg-green-500/10', text: 'text-green-700', border: 'border-green-500/20' },
  slice: { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-500/20' },
  historical: { bg: 'bg-amber-800/10', text: 'text-amber-900', border: 'border-amber-800/20' },
  supernatural: { bg: 'bg-indigo-500/10', text: 'text-indigo-700', border: 'border-indigo-500/20' },
  martial: { bg: 'bg-orange-600/10', text: 'text-orange-800', border: 'border-orange-600/20' },
  default: { bg: 'bg-primary/5', text: 'text-primary', border: 'border-primary/10' },
};

function getGenreColor(slug) {
  if (!slug) return GENRE_COLORS.default;
  const s = slug.toLowerCase();
  for (const [key, val] of Object.entries(GENRE_COLORS)) {
    if (s.includes(key)) return val;
  }
  return GENRE_COLORS.default;
}

/* ═══ Genre emoji map ═══ */
const GENRE_EMOJI = {
  action: '⚔️', adventure: '🗺️', comedy: '😂', drama: '🎭',
  fantasy: '🧙', horror: '👻', romance: '💕', 'sci-fi': '🚀',
  thriller: '🔪', mystery: '🔍', sports: '⚽', slice: '🌸',
  historical: '🏛️', supernatural: '👁️', martial: '🥊',
  isekai: '🌀', shounen: '💪', shoujo: '💖', seinen: '🎯',
  josei: '👩', mecha: '🤖', magic: '✨', school: '🏫',
  military: '🎖️', psychological: '🧠', cooking: '🍳',
  music: '🎵', medical: '⚕️', gaming: '🎮', reincarnation: '♻️',
};

function getGenreEmoji(slug) {
  if (!slug) return '📚';
  const s = slug.toLowerCase();
  for (const [key, val] of Object.entries(GENRE_EMOJI)) {
    if (s.includes(key)) return val;
  }
  return '📚';
}

/* ═══ Cover Image ═══ */
function CoverImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const url = src?.large || src?.small || src;
  return (
    <div className="relative overflow-hidden bg-primary/5 aspect-[3/4]">
      {!loaded && !error && <div className="absolute inset-0 animate-pulse bg-primary/5" />}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
          <IconBook size={24} className="text-primary/20" />
        </div>
      ) : (
        <img
          src={url} alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)} onError={() => setError(true)} loading="lazy"
        />
      )}
    </div>
  );
}

/* ═══ Series Card ═══ */
function SeriesCard({ series, onClick }) {
  return (
    <button
      onClick={() => onClick(series)}
      className="group text-left w-full transition-all duration-300 hover:-translate-y-2 rounded-2xl"
    >
      <div className="relative rounded-2xl overflow-hidden border border-primary/8 shadow-sm group-hover:shadow-brutal-lg group-hover:border-primary/15 transition-all duration-300">
        <CoverImage src={series.cover} alt={series.title} />
        {series.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-lg border border-white/10">
            <IconStarFilled size={11} className="text-yellow-400" />
            {series.rating}
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-bold text-primary line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
          {series.title}
        </h3>
        {series.chapters_count && (
          <p className="text-[11px] text-gray-500 mt-0.5">{series.chapters_count} chapters</p>
        )}
      </div>
    </button>
  );
}

/* ═══ Main ═══ */
export default function GenresContent() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);
  const [series, setSeries] = useState([]);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedSeries, setSelectedSeries] = useState(null);

  useEffect(() => {
    fetch(`${API}/genres`)
      .then(r => r.json())
      .then(d => { if (d.success) setGenres(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadSeries = useCallback(async (genre, p = 1) => {
    setSeriesLoading(true);
    try {
      const res = await fetch(`${API}/search?q=a&genre=${genre}&page=${p}`);
      const json = await res.json();
      if (json.success) {
        if (p === 1) setSeries(json.data);
        else setSeries(prev => [...prev, ...json.data]);
        setTotal(json.pagination?.total || json.data.length);
        setPage(p);
      }
    } catch {}
    finally { setSeriesLoading(false); }
  }, []);

  const handleGenreClick = (slug) => {
    if (activeGenre === slug) {
      setActiveGenre(null);
      setSeries([]);
      return;
    }
    setActiveGenre(slug);
    loadSeries(slug, 1);
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 nav-frosted-solid">
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary text-white flex items-center justify-center font-bold text-sm" style={{ borderRadius: 10, fontFamily: '"Noto Serif JP", serif' }}>水</div>
            <span className="text-lg font-bold font-display uppercase tracking-tight">ShineiAPI</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/browse" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Browse</Link>
            <Link href="/browse/genres" className="text-sm font-semibold text-primary bg-accent/80 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Genres</Link>
            <Link href="/docs" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Docs</Link>
            <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
              <IconGithub size={15} /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-containerWidth mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link href="/browse" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors mb-4">
              <IconArrowLeft size={14} /> Back to Browse
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-primary text-xs font-bold rounded-lg mb-4">
              <IconTag size={13} /> Genres
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display uppercase tracking-tight text-primary">
              Browse by <span className="text-secondary">Genre</span>
            </h1>
            <p className="text-gray-600 mt-3 max-w-lg">
              Explore manga, manhwa, and webtoons by genre. Click a genre to see series.
            </p>
          </div>

          {/* Genre Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse bg-primary/5 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {genres.map((g) => {
                const colors = getGenreColor(g.slug);
                const emoji = getGenreEmoji(g.slug);
                const isActive = activeGenre === g.slug;
                return (
                  <button
                    key={g.slug}
                    onClick={() => handleGenreClick(g.slug)}
                    className={`group relative p-4 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 ${
                      isActive
                        ? 'bg-primary text-white border-primary shadow-brutal-lg'
                        : `${colors.bg} ${colors.border} border hover:shadow-brutal`
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{emoji}</span>
                    <h3 className={`text-sm font-bold uppercase tracking-tight ${isActive ? 'text-white' : colors.text}`}>
                      {g.name}
                    </h3>
                    {g.description && (
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                        {g.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Series Results */}
          {activeGenre && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">
                  {genres.find(g => g.slug === activeGenre)?.name || activeGenre} Series
                </h2>
                <span className="text-xs text-gray-500 font-bold">{total} found</span>
              </div>
              {seriesLoading && series.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-[3/4] animate-pulse bg-primary/5 rounded-2xl" />
                      <div className="h-4 w-3/4 animate-pulse bg-primary/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : series.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {series.map((s, i) => (
                      <SeriesCard key={s.id || s.slug || i} series={s} onClick={setSelectedSeries} />
                    ))}
                  </div>
                  {page * 25 < total && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => loadSeries(activeGenre, page + 1)}
                        disabled={seriesLoading}
                        className="btn-brutal-outline !text-xs disabled:opacity-50"
                      >
                        {seriesLoading ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No series found for this genre.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-primary text-white" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-containerWidth mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent text-primary flex items-center justify-center font-bold text-sm" style={{ borderRadius: 8, fontFamily: '"Noto Serif JP", serif' }}>水</div>
              <span className="font-bold font-display uppercase tracking-tight text-accent">ShineiAPI</span>
              <span className="text-[10px] text-white/40 font-mono px-2 py-0.5" style={{ borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>v2.0.2</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">GitHub</a>
              <Link href="/terms" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Terms</Link>
              <Link href="/privacy" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Privacy</Link>
              <Link href="/support" className="text-xs sm:text-sm text-white/50 hover:text-accent transition-colors font-semibold uppercase tracking-wider">Support</Link>
            </div>
            <p className="text-sm text-white/40">
              Built with <IconHeart size={14} className="heartbeat" /> by <a href="https://github.com/Shineii86" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-bold">Shinei Nouzen</a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
