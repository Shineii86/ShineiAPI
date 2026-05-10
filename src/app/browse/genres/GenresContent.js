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

function formatRating(r) {
  if (!r && r !== 0) return null;
  const n = parseFloat(r);
  if (isNaN(n)) return r;
  return n.toFixed(1);
}

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

/* ═══ Genre icon SVGs ═══ */
const GENRE_ICONS = {
  action: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 17.5 5-5-5-5"/><path d="m9.5 7.5-5 5 5 5"/></svg>,
  adventure: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>,
  comedy: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>,
  drama: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 8v4l3 3"/></svg>,
  fantasy: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>,
  horror: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  romance: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>,
  'sci-fi': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>,
  thriller: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  mystery: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  sports: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  slice: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  historical: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  supernatural: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
  martial: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  isekai: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>,
  shounen: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  shoujo: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>,
  seinen: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>,
  josei: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10C8.55 2.04 4.86 7.66 4.5 12c-.37 4.43 1.27 9.95 7.5 10z"/></svg>,
  mecha: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>,
  magic: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>,
  school: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>,
  military: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  psychological: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>,
  cooking: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="M8 4v6"/><path d="M16 4v6"/><path d="M3 12h18a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-2a1 1 0 0 1 1-1z"/></svg>,
  music: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  medical: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="16" height="18" x="4" y="4" rx="2"/><path d="M12 11v4"/><path d="M10 13h4"/></svg>,
  gaming: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>,
  reincarnation: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>,
};

function getGenreIcon(slug) {
  if (!slug) return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
  const s = slug.toLowerCase();
  for (const [key, val] of Object.entries(GENRE_ICONS)) {
    if (s.includes(key)) return val;
  }
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
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
            {formatRating(series.rating)}
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
                const icon = getGenreIcon(g.slug);
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
                    <span className={`mb-2 block ${isActive ? 'text-white' : colors.text}`}>{icon}</span>
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
