/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/middleware.js
 * Purpose    : Request middleware for rate limiting and logging
 *
 * Summary    :
 * Next.js middleware that runs on every API request. Implements
 * IP-based rate limiting using a sliding window algorithm,
 * adds request logging for debugging, and handles CORS
 * preflight (OPTIONS) requests automatically.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

import { NextResponse } from 'next/server';
import { RATE_LIMIT } from './lib/constants';

/**
 * In-memory rate limit store
 *
 * Maps IP addresses to arrays of request timestamps.
 * Each entry is cleaned up when the rate limit window expires.
 * This is a simple sliding window approach suitable for
 * serverless environments with short-lived instances.
 *
 * @type {Map<string, number[]>}
 */
const rateLimitStore = new Map();

/**
 * Extract client IP address from request headers
 *
 * Checks various headers that proxies and load balancers
 * use to forward the original client IP. Falls back to
 * '127.0.0.1' if no IP can be determined.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {string} The client's IP address
 */
function getClientIp(request) {
  /* Check common proxy headers in order of preference */
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    /* x-forwarded-for can contain multiple IPs; take the first one */
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  return '127.0.0.1';
}

/**
 * Check if a request exceeds the rate limit
 *
 * Implements a sliding window rate limiter. Counts requests
 * made by the same IP within the current window and compares
 * against the configured maximum.
 *
 * @param {string} clientIp - The client's IP address
 * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
 *   - allowed: Whether the request should proceed
 *   - remaining: How many requests are left in the window
 *   - retryAfter: Seconds until the rate limit resets
 */
function checkRateLimit(clientIp) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.WINDOW_MS;

  /* Get existing timestamps for this IP */
  let timestamps = rateLimitStore.get(clientIp) || [];

  /* Remove timestamps outside the current window */
  timestamps = timestamps.filter(ts => ts > windowStart);

  /* Check if adding this request would exceed the limit */
  if (timestamps.length >= RATE_LIMIT.MAX_REQUESTS) {
    /* Calculate when the oldest request in the window will expire */
    const oldestInWindow = timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + RATE_LIMIT.WINDOW_MS - now) / 1000);

    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(retryAfter, 1),
    };
  }

  /* Add current timestamp and update the store */
  timestamps.push(now);
  rateLimitStore.set(clientIp, timestamps);

  return {
    allowed: true,
    remaining: RATE_LIMIT.MAX_REQUESTS - timestamps.length,
    retryAfter: 0,
  };
}

/**
 * Next.js middleware function
 *
 * Runs on every matched request. Handles:
 * 1. CORS preflight (OPTIONS) requests
 * 2. Rate limiting for API endpoints
 * 3. Request logging for debugging
 * 4. Security headers injection
 *
 * @param {Request} request - The incoming HTTP request
 * @param {object} context  - Next.js middleware context
 * @returns {NextResponse} The response to send back
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const clientIp = getClientIp(request);

  /* ─── Handle CORS preflight requests ─── */
  if (method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  /* ─── Apply rate limiting to API routes only ─── */
  if (pathname.startsWith('/api/')) {
    const { allowed, remaining, retryAfter } = checkRateLimit(clientIp);

    if (!allowed) {
      /* Return 429 Too Many Requests with retry information */
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded. Maximum ${RATE_LIMIT.MAX_REQUESTS} requests per minute. Retry after ${retryAfter} seconds.`,
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
            'X-RateLimit-Limit': String(RATE_LIMIT.MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    /* ─── Log the request for debugging ─── */
    const requestId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${requestId} ${method} ${pathname} — IP: ${clientIp} — Remaining: ${remaining}`
    );

    /* ─── Continue with rate limit headers in the response ─── */
    const response = NextResponse.next();

    /* Add rate limit info headers to every API response */
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT.MAX_REQUESTS));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-Request-ID', requestId);
    response.headers.set('X-Powered-By', 'ShineiAPI v2.0.3');
    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
  }

  /* ─── Non-API requests pass through unchanged ─── */
  return NextResponse.next();
}

/**
 * Middleware matcher configuration
 *
 * Only runs on API routes. Static assets and page routes
 * are excluded for performance.
 */
export const config = {
  matcher: [
    '/api/:path*',
  ],
};

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
