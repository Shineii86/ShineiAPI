/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/lib/constants.js
 * Purpose    : Application constants and configuration values
 *
 * Summary    :
 * Centralizes all magic strings, default values, genre lists,
 * and configuration constants used throughout the API. Keeping
 * these here prevents duplication and makes updates easy.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

/* ─── Upstream Toraka API Configuration ─── */
const TORAKA = {
  BASE_URL: process.env.TORAKA_BASE_URL || 'https://core.toraka.com/api/v1',
  TIMEOUT: 10000, /* 10 second timeout for upstream requests */
};

/* ─── Cache Configuration ─── */
const CACHE = {
  TTL: parseInt(process.env.CACHE_TTL || '300', 10), /* 5 minutes default */
  CHECK_PERIOD: 60, /* Check for expired entries every 60 seconds */
  MAX_ENTRIES: 1000, /* Maximum cached responses */
};

/* ─── Rate Limiting ─── */
const RATE_LIMIT = {
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  WINDOW_MS: 60 * 1000, /* 1 minute window */
};

/* ─── API Response Metadata ─── */
const API_META = {
  VERSION: '2.0.1',
  NAME: 'ShineiAPI',
  DESCRIPTION: 'Unofficial Toraka REST API Wrapper for Manga, Manhwa & Webtoons',
  AUTHOR: 'Shineii86',
  REPO: 'https://github.com/Shineii86/ShineiAPI',
  DOCS_URL: 'https://shineiapi.vercel.app/docs',
};

/* ─── Content Types ─── */
const CONTENT_TYPES = {
  MANGA: 'manga',
  MANHWA: 'manhwa',
  MANHUA: 'manhua',
  WEBTOON: 'webtoon',
  COMIC: 'comic',
  NOVEL: 'novel',
  ONE_SHOT: 'one-shot',
  DOUJINSHI: 'doujinshi',
};

/* ─── Release Statuses ─── */
const STATUS = {
  RELEASING: 'releasing',
  COMPLETED: 'completed',
  HIATUS: 'hiatus',
  CANCELLED: 'cancelled',
  NOT_YET_RELEASED: 'not_yet_released',
};

/* ─── Known Genres ─── */
const GENRES = [
  'action', 'adventure', 'comedy', 'drama', 'fantasy',
  'horror', 'mystery', 'psychological', 'romance', 'sci-fi',
  'slice-of-life', 'sports', 'supernatural', 'thriller',
  'martial-arts', 'murim', 'system', 'isekai', 'reincarnation',
  'harem', 'mecha', 'military', 'music', 'parody',
  'police', 'samurai', 'school', 'seinen', 'shoujo',
  'shounen', 'space', 'super-power', 'tragedy', 'vampire',
  'game', 'historical', 'demons', 'magic', 'ecchi',
];

/* ─── Days of the Week (for schedule) ─── */
const DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'saturday', 'sunday',
];

/* ─── Sort Options ─── */
const SORT_OPTIONS = [
  'title', 'rating', 'popularity', 'score',
  'chapters', 'bookmarks', 'updated', 'created',
];

/* ─── Pagination Defaults ─── */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
};

/* ─── Export all constants ─── */
module.exports = {
  TORAKA,
  CACHE,
  RATE_LIMIT,
  API_META,
  CONTENT_TYPES,
  STATUS,
  GENRES,
  DAYS,
  SORT_OPTIONS,
  PAGINATION,
};

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
