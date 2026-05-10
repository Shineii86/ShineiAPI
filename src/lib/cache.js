/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/lib/cache.js
 * Purpose    : In-memory cache with TTL for API responses
 *
 * Summary    :
 * Implements a simple in-memory caching layer using a Map.
 * Each cached entry stores its data alongside an expiry
 * timestamp. Expired entries are lazily evicted on access
 * and periodically cleaned up to prevent memory leaks.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const { CACHE } = require('./constants');

/**
 * In-memory cache store
 * Uses a Map where keys are cache keys and values are
 * objects containing { data, expiry } pairs.
 * @type {Map<string, {data: any, expiry: number}>}
 */
const store = new Map();

/**
 * Cache hit/miss statistics for monitoring
 * Tracks how effective the cache is over time.
 */
const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  evictions: 0,
};

/**
 * Get a value from the cache
 *
 * Returns the cached data if it exists and hasn't expired.
 * If the entry has expired, it's automatically deleted and
 * null is returned (cache miss).
 *
 * @param {string} key - The cache key to look up
 * @returns {any|null} The cached data or null on miss
 *
 * @example
 * const data = cache.get('series:solo-leveling');
 * if (data) { return data; } // cache hit
 */
function get(key) {
  const entry = store.get(key);

  /* Cache miss — key doesn't exist */
  if (!entry) {
    stats.misses++;
    return null;
  }

  /* Cache miss — entry has expired, clean it up */
  if (Date.now() > entry.expiry) {
    store.delete(key);
    stats.evictions++;
    stats.misses++;
    return null;
  }

  /* Cache hit — return the stored data */
  stats.hits++;
  return entry.data;
}

/**
 * Set a value in the cache
 *
 * Stores data with a TTL (time-to-live). The entry will
 * automatically be considered expired after the TTL elapses.
 *
 * @param {string} key    - The cache key
 * @param {any}    data   - The data to cache
 * @param {number} [ttl]  - TTL in seconds (defaults to CACHE.TTL)
 *
 * @example
 * cache.set('series:solo-leveling', seriesData, 300);
 */
function set(key, data, ttl = CACHE.TTL) {
  /* Enforce maximum cache size — evict oldest entries */
  if (store.size >= CACHE.MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    store.delete(oldestKey);
    stats.evictions++;
  }

  /* Store the data with its expiry timestamp */
  store.set(key, {
    data,
    expiry: Date.now() + (ttl * 1000), /* Convert seconds to milliseconds */
  });

  stats.sets++;
}

/**
 * Delete a specific entry from the cache
 *
 * @param {string} key - The cache key to delete
 * @returns {boolean} True if the entry existed and was deleted
 */
function del(key) {
  return store.delete(key);
}

/**
 * Clear all cached entries
 *
 * Useful for cache invalidation or testing. Resets both
 * the store and the statistics counters.
 */
function clear() {
  store.clear();
  stats.hits = 0;
  stats.misses = 0;
  stats.sets = 0;
  stats.evictions = 0;
}

/**
 * Get current cache statistics
 *
 * Returns hit rate, total entries, and other useful metrics
 * for monitoring cache effectiveness.
 *
 * @returns {object} Cache statistics
 */
function getStats() {
  const total = stats.hits + stats.misses;
  return {
    entries: store.size,
    maxEntries: CACHE.MAX_ENTRIES,
    hitRate: total > 0 ? ((stats.hits / total) * 100).toFixed(1) + '%' : '0%',
    hits: stats.hits,
    misses: stats.misses,
    sets: stats.sets,
    evictions: stats.evictions,
  };
}

/**
 * Generate a cache key from request parameters
 *
 * Creates deterministic cache keys from endpoint and params
 * so the same request always maps to the same cache entry.
 *
 * @param {string} endpoint - The API endpoint path
 * @param {object} [params] - Query or path parameters
 * @returns {string} A formatted cache key
 *
 * @example
 * makeKey('series', { slug: 'solo-leveling' })
 * // → 'series:slug:solo-leveling'
 *
 * makeKey('search', { q: 'nano machine', page: 1 })
 * // → 'search:page:1:q:nano machine'
 */
function makeKey(endpoint, params = {}) {
  /* Sort params for consistent key generation */
  const sortedParams = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join(':');

  return sortedParams ? `${endpoint}:${sortedParams}` : endpoint;
}

/**
 * Periodic cleanup of expired entries
 *
 * Runs every CACHE.CHECK_PERIOD seconds to remove expired
 * entries. This prevents memory leaks from entries that are
 * set but never accessed again.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiry) {
      store.delete(key);
      stats.evictions++;
    }
  }
}, CACHE.CHECK_PERIOD * 1000);

/* ─── Export all cache functions ─── */
module.exports = {
  get,
  set,
  del,
  clear,
  getStats,
  makeKey,
};

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
