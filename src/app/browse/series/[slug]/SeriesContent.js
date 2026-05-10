'use client';

/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Series Content — Full series detail page            ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IconArrowLeft, IconStarFilled, IconBook, IconGithub,
  IconHeart, IconChevronDown, IconX, IconExternalLink,
} from '@/components/icons';

const API = '/api/v1';

function CoverImage({ src, alt, className = '', aspect = 'aspect-[3/4]' }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const url = src?.large || src?.small || src;
  return (
    <div className={`relative overflow-hidden bg-primary/5 ${aspect} ${className}`}>
      {!loaded && !error && <div className="absolute inset-0 animate-pulse bg-primary/5" />}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
          <IconBook size={32} className="text-primary/20" />
        </div>
      ) : (
        <img
          src={url} alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)} onError={() => setError(true)}
        />
      )}
    </div>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-primary/5 rounded-2xl ${className}`} />;
}

export default function SeriesContent({ slug }) {
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllChapters, setShowAllChapters] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/series/${slug}?include=chapters`)
      .then(r => r.json())
      .then(d => { if (d.success) setSeries(d.data); else setError(d.error?.message || 'Not found'); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const chapters = series?.chapters || [];
  const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 50);

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
            <Link href="/docs" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200" style={{ borderRadius: 10 }}>Docs</Link>
            <a href="https://github.com/Shineii86/ShineiAPI" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary/70 hover:text-primary hover:bg-black/5 px-3 py-1.5 transition-all duration-200 flex items-center gap-1.5" style={{ borderRadius: 10 }}>
              <IconGithub size={15} /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20 sm:pt-24 pb-16">
        {/* Back */}
        <div className="max-w-containerWidth mx-auto px-4 sm:px-6 mb-6">
          <Link href="/browse" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors">
            <IconArrowLeft size={14} /> Back to Browse
          </Link>
        </div>

        {loading ? (
          <div className="max-w-containerWidth mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <Skeleton className="w-48 sm:w-56 aspect-[3/4] shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-3">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-containerWidth mx-auto px-4 sm:px-6 text-center py-20">
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <IconX size={36} className="text-secondary" />
            </div>
            <h2 className="text-2xl font-bold font-display text-primary mb-3">Series Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
            <Link href="/browse" className="btn-brutal">Back to Browse</Link>
          </div>
        ) : series && (
          <>
            {/* Banner */}
            <div className="relative h-56 sm:h-72 md:h-80 bg-primary overflow-hidden">
              {series.banner ? (
                <img src={series.banner} alt="" className="w-full h-full object-cover opacity-40" />
              ) : series.cover ? (
                <img src={series.cover?.large || series.cover} alt="" className="w-full h-full object-cover opacity-20 blur-xl scale-110" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
            </div>

            {/* Detail */}
            <div className="relative max-w-containerWidth mx-auto px-4 sm:px-6 -mt-32 sm:-mt-36">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
                {/* Cover */}
                <div className="w-40 sm:w-52 shrink-0 mx-auto sm:mx-0">
                  <div className="rounded-2xl overflow-hidden border-4 border-surface shadow-brutal-lg">
                    <CoverImage src={series.cover} alt={series.title} />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 pt-4 sm:pt-12 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display uppercase tracking-tight text-primary leading-tight">
                    {series.title}
                  </h1>
                  {series.alt_titles?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1.5 font-medium">{series.alt_titles[0]}</p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                    {series.rating && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/20 text-primary text-xs font-bold rounded-lg">
                        <IconStarFilled size={12} className="text-yellow-500" />
                        {series.rating}
                      </span>
                    )}
                    {series.status && (
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                        series.status === 'Completed' ? 'bg-green-500/10 text-green-700 border-green-500/20' :
                        series.status === 'Releasing' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>{series.status}</span>
                    )}
                    {series.type && (
                      <span className="px-2.5 py-1 bg-primary/5 text-primary/70 text-xs font-bold rounded-lg border border-primary/10">
                        {series.type}
                      </span>
                    )}
                  </div>

                  {/* Synopsis */}
                  {series.synopsis && (
                    <p className="text-sm text-gray-600 leading-relaxed mt-5 max-w-xl">
                      {series.synopsis}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                    {series.chapters_count != null && (
                      <div className="p-3 bg-primary/5 rounded-xl text-center sm:text-left">
                        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Chapters</p>
                        <p className="text-lg font-bold font-display text-primary mt-0.5">{series.chapters_count}</p>
                      </div>
                    )}
                    {series.bookmarks_count != null && (
                      <div className="p-3 bg-primary/5 rounded-xl text-center sm:text-left">
                        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Bookmarks</p>
                        <p className="text-lg font-bold font-display text-primary mt-0.5">{series.bookmarks_count.toLocaleString()}</p>
                      </div>
                    )}
                    {series.rating_count != null && (
                      <div className="p-3 bg-primary/5 rounded-xl text-center sm:text-left">
                        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Ratings</p>
                        <p className="text-lg font-bold font-display text-primary mt-0.5">{series.rating_count.toLocaleString()}</p>
                      </div>
                    )}
                    {series.popularity_rank != null && (
                      <div className="p-3 bg-primary/5 rounded-xl text-center sm:text-left">
                        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Rank</p>
                        <p className="text-lg font-bold font-display text-primary mt-0.5">#{series.popularity_rank}</p>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {series.genres?.length > 0 && (
                    <div className="mt-5">
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {series.genres.map((g, i) => (
                          <Link
                            key={i}
                            href={`/browse/genres?genre=${g.slug || g.name || g}`}
                            className="px-3 py-1.5 bg-accent/15 text-primary text-xs font-bold rounded-lg border border-primary/8 hover:bg-accent/30 transition-colors"
                          >
                            {g.name || g}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Authors */}
                  {(series.authors?.length > 0 || series.artists?.length > 0) && (
                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-6 text-sm">
                      {series.authors?.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Author: </span>
                          <span className="font-semibold text-primary">{series.authors.map(a => a.name || a).join(', ')}</span>
                        </div>
                      )}
                      {series.artists?.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Artist: </span>
                          <span className="font-semibold text-primary">{series.artists.map(a => a.name || a).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Official Sources */}
                  {series.official_sources?.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                      {series.official_sources.map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-lg border border-primary/8 hover:bg-accent/20 transition-colors">
                          {s.name} <IconExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chapters */}
              {chapters.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold font-display uppercase tracking-tight text-primary">
                      Chapters <span className="text-gray-400 font-normal text-sm">({chapters.length})</span>
                    </h2>
                    {chapters.length > 50 && (
                      <button
                        onClick={() => setShowAllChapters(!showAllChapters)}
                        className="text-xs font-bold text-tertiary hover:text-tertiary/80 transition-colors flex items-center gap-1"
                      >
                        {showAllChapters ? 'Show Less' : `Show All ${chapters.length}`}
                        <IconChevronDown size={14} className={`transition-transform ${showAllChapters ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  <div className="bg-surface-bright rounded-2xl border border-primary/8 overflow-hidden">
                    <div className="max-h-[32rem] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                      {visibleChapters.map((ch, i) => (
                        <div
                          key={ch.id || i}
                          className="flex items-center justify-between px-5 py-3.5 hover:bg-primary/[0.03] transition-colors border-b border-primary/5 last:border-b-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono text-gray-400 w-10 text-right shrink-0">
                              {ch.order || `#${i + 1}`}
                            </span>
                            <span className="text-sm font-semibold text-primary truncate">
                              {ch.title || `Chapter ${ch.order || i + 1}`}
                            </span>
                          </div>
                          {ch.published_at && (
                            <span className="text-[11px] text-gray-400 font-medium shrink-0 ml-3">
                              {new Date(ch.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* API Info */}
              <div className="mt-10 p-6 bg-primary/5 rounded-2xl border border-primary/8">
                <p className="text-xs text-gray-500 font-mono">
                  Data from <code className="text-tertiary">GET /api/v1/series/{slug}?include=chapters</code>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Powered by <a href="https://shineiapi.vercel.app" target="_blank" rel="noopener noreferrer" className="text-tertiary hover:underline">ShineiAPI</a>
                </p>
              </div>
            </div>
          </>
        )}
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
