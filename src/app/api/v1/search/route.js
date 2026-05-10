/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Search endpoint — GET /api/v1/search?q={query}      ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/search/route.js
 * Purpose    : Full-text search with optional filters
 *
 * Summary    :
 * Full-text search across manga, manhwa, and webtoons.
 * Accepts a query string and optional filters (genre,
 * source, type, status, page). Returns matched results
 * with relevance ranking and metadata.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const { success, error, cors } = require('@/lib/response');
const cache = require('@/lib/cache');

/* ─── Toraka API base ─── */
const TORAKA_BASE = 'https://core.toraka.com/api/v1';

/* ─── Cache TTL ─── */
const SEARCH_CACHE_TTL = 600; /* 10 minutes */

/**
 * GET handler for /api/v1/search
 *
 * Performs a search query against the Toraka catalog with
 * optional filters for genre, source, type, and status.
 * Fully backward compatible — only `q` still works.
 *
 * Query Parameters:
 *   - q      (required) — Search query string (min 2 chars)
 *   - page   (optional) — Page number, defaults to 1
 *   - genre  (optional) — Genre slug filter (e.g., 'action', 'fantasy')
 *   - source (optional) — Source name filter (e.g., 'kakao-page')
 *   - type   (optional) — Content type (e.g., 'manhwa', 'manga')
 *   - status (optional) — Release status (e.g., 'releasing', 'completed')
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with search results or error
 *
 * @example
 * GET /api/v1/search?q=solo+leveling
 * GET /api/v1/search?q=nano+machine&page=1
 * GET /api/v1/search?q=tower&genre=fantasy&type=manhwa
 * GET /api/v1/search?q=solo&status=completed&source=kakao-page
 */
export async function GET(request) {
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    const { searchParams } = new URL(request.url);

    /* ─── Parse parameters ─── */
    const query  = searchParams.get('q');
    const page   = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const genre  = searchParams.get('genre')?.trim() || null;
    const source = searchParams.get('source')?.trim() || null;
    const type   = searchParams.get('type')?.trim() || null;
    const status = searchParams.get('status')?.trim() || null;

    /* ─── Validate query ─── */
    if (!query || query.trim().length === 0) {
      return error(
        400,
        'Search query parameter "q" is required. Example: /api/v1/search?q=solo+leveling',
        'MISSING_QUERY'
      );
    }

    if (query.trim().length < 2) {
      return error(
        400,
        'Search query must be at least 2 characters long.',
        'QUERY_TOO_SHORT'
      );
    }

    /* ─── Check cache ─── */
    const cacheKey = cache.makeKey('search', { q: query.trim(), page, genre, source, type, status });
    const cached = cache.get(cacheKey);
    if (cached) {
      return success(cached.data, {
        page,
        limit: 25,
        total: cached.total,
      });
    }

    /* ─── Build Toraka URL ─── */
    const url = new URL(`${TORAKA_BASE}/search`);
    url.searchParams.append('q', query.trim());
    url.searchParams.append('page', String(page));
    if (genre)  url.searchParams.append('genre', genre);
    if (source) url.searchParams.append('source', source);
    if (type)   url.searchParams.append('type', type);
    if (status) url.searchParams.append('status', status);

    /* ─── Fetch from Toraka ─── */
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ShineiAPI/2.0.2 (github.com/Shineii86/ShineiAPI)',
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[Search API] Toraka returned ${response.status}: ${errorText}`);

      if (response.status === 429) {
        return error(429, 'Upstream API rate limit exceeded. Try again later.', 'UPSTREAM_RATE_LIMIT');
      }
      return error(502, 'Upstream API returned an error.', 'UPSTREAM_ERROR');
    }

    const data = await response.json();

    /* ─── Normalize results ─── */
    const results = (data.data || []).map(item => ({
      id: item.uuid,
      title: item.name || item.title,
      slug: item.slug,
      synopsis: item.synopsis,
      alt_titles: item.alt_titles || [],
      authors: item.authors || [],
      artists: item.artists || [],
      genres: item.genres || [],
      type: item.type,
      status: item.status,
      rating: item.rating,
      chapters_count: item.chapters_count,
      bookmarks_count: item.bookmarks_count,
      popularity_rank: item.popularity_rank,
      trending_rank: item.trending_rank,
      cover: item.cover,
      sources: (item.available_sources || []).map(s => ({
        id: s.uuid,
        name: s.name,
        latest_chapter: s.latest_chapter,
        color: s.color,
      })),
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    const total = data.pagination?.total || results.length;

    /* ─── Cache the result ─── */
    cache.set(cacheKey, { data: results, total }, SEARCH_CACHE_TTL);

    return success(results, {
      page,
      limit: 25,
      total,
    });

  } catch (err) {
    console.error('[Search API] Error:', err.message);

    if (err.name === 'AbortError') {
      return error(504, 'Upstream API search timed out. Try a shorter query.', 'UPSTREAM_TIMEOUT');
    }

    return error(500, 'An unexpected error occurred while searching.', 'INTERNAL_ERROR');
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return cors();
}
