/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Next.js Configuration                               ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Don't leak "X-Powered-By: Next.js" header */
  poweredByHeader: false,

  /* Strict mode for better React practices */
  reactStrictMode: true,

  /* Security & caching headers */
  async headers() {
    return [
      {
        /* API routes — no caching, CORS */
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        /* Static assets — long cache */
        source: '/:all*(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        /* HTML pages — short cache, revalidate */
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://media.toraka.com https://avatars.githubusercontent.com",
              "connect-src 'self' https://shineiapi.vercel.app https://api.github.com https://core.toraka.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
