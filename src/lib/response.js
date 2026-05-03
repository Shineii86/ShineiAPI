/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/lib/response.js
 * Purpose    : Standardized API response builders
 *
 * Summary    :
 * Provides helper functions to create consistent JSON responses
 * across all API endpoints. Every response follows the same
 * envelope format with success flag, data, and metadata.
 * Error responses include descriptive messages and codes.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const { API_META } = require('./constants');
const crypto = require('crypto');

/**
 * Create a successful API response
 *
 * Wraps data in the standard response envelope with success
 * flag and optional pagination metadata. The response always
 * includes a timestamp and API version.
 *
 * @param {any}    data              - The response data
 * @param {object} [options]         - Additional response options
 * @param {number} [options.page]    - Current page number
 * @param {number} [options.limit]   - Items per page
 * @param {number} [options.total]   - Total items available
 * @returns {Response} Next.js Response object
 *
 * @example
 * return success({ title: 'Solo Leveling', ... });
 * // → { success: true, data: { ... }, timestamp: '...' }
 *
 * @example
 * return success(results, { page: 1, limit: 25, total: 100 });
 * // → { success: true, data: [...], pagination: { ... } }
 */
function success(data, options = {}) {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  /* Add pagination metadata if provided */
  if (options.page || options.limit || options.total) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 25;
    const total = parseInt(options.total, 10) || 0;

    response.pagination = {
      last_visible_page: Math.ceil(total / limit) || 1,
      has_next_page: (page * limit) < total,
      current_page: page,
      items: {
        count: Array.isArray(data) ? data.length : 1,
        total: total,
        per_page: limit,
      },
    };
  }

  /* Include API version in headers */
  const body = JSON.stringify(response);
  const etag = '"' + crypto.createHash('md5').update(body).digest('hex') + '"';

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': API_META.VERSION,
      'Access-Control-Allow-Origin': '*',
      'ETag': etag,
    },
  });
}

/**
 * Create an error API response
 *
 * Returns a standardized error response with HTTP status code,
 * error message, and optional error code for client handling.
 *
 * @param {number} status       - HTTP status code
 * @param {string} message      - Human-readable error message
 * @param {string} [code]       - Machine-readable error code
 * @returns {Response} Next.js Response object
 *
 * @example
 * return error(404, 'Series not found', 'SERIES_NOT_FOUND');
 * // → { success: false, error: { ... } }
 *
 * @example
 * return error(429, 'Rate limit exceeded', 'RATE_LIMIT_EXCEEDED');
 */
function error(status, message, code = 'UNKNOWN_ERROR') {
  const errorResponse = {
    success: false,
    error: {
      code,
      message,
      status,
    },
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': API_META.VERSION,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

/**
 * Create a 200 OK response for OPTIONS requests
 *
 * Handles CORS preflight requests by returning appropriate
 * headers without a body.
 *
 * @returns {Response} Empty 200 response with CORS headers
 */
function cors() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', /* 24 hours */
    },
  });
}

/**
 * Create a rate limit error response
 *
 * Specialized error for rate limiting that includes
 * Retry-After header to help clients back off gracefully.
 *
 * @param {number} retryAfter - Seconds until rate limit resets
 * @returns {Response} 429 Too Many Requests response
 *
 * @example
 * return rateLimitError(45); // Retry after 45 seconds
 */
function rateLimitError(retryAfter = 60) {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Maximum ${60} requests per minute. Please retry after ${retryAfter} seconds.`,
        status: 429,
        retry_after: retryAfter,
      },
      timestamp: new Date().toISOString(),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

/* ─── Export all response builders ─── */
module.exports = {
  success,
  error,
  cors,
  rateLimitError,
};

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
