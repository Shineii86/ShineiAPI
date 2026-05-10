/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Root Layout — Neo-Brutalist                         ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import './globals.css';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import BackToTop from '@/components/BackToTop';
import ScrollProgress from '@/components/ScrollProgress';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#f5f0e8',
};

export const metadata = {
  metadataBase: new URL('https://shineiapi.vercel.app'),
  title: {
    default: 'ShineiAPI — Free Manga & Manhwa REST API',
    template: '%s | ShineiAPI',
  },
  description:
    'ShineiAPI provides free, fast manga and manhwa data with no authentication, built on the Toraka API with caching and error handling. Perfect for your next manga tracker app.',
  keywords: [
    'manga api', 'manhwa api', 'webtoon api', 'rest api', 'anime api',
    'manga data', 'manhwa data', 'jikan alternative', 'toraka wrapper',
    'free api', 'open source api', 'next.js api', 'manga tracker',
  ],
  authors: [{ name: 'Shinei Nouzen', url: 'https://github.com/Shineii86' }],
  creator: 'Shineii86',
  publisher: 'ShineiAPI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shineiapi.vercel.app',
    title: 'ShineiAPI — Free Manga & Manhwa REST API',
    description:
      'Free, fast manga and manhwa data with no authentication. Built on Toraka with caching, rate limiting, and clean JSON responses.',
    siteName: 'ShineiAPI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShineiAPI — Free Manga & Manhwa REST API',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShineiAPI — Free Manga & Manhwa REST API',
    description:
      'Free, fast manga and manhwa data with no authentication. Perfect for your next manga tracker app.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="canonical" href="https://shineiapi.vercel.app" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebAPI',
              name: 'ShineiAPI',
              description: 'Free REST API for manga, manhwa, and webtoon data. No authentication required.',
              url: 'https://shineiapi.vercel.app',
              documentation: 'https://shineiapi.vercel.app/docs',
              provider: { '@type': 'Person', name: 'Shinei Nouzen', url: 'https://github.com/Shineii86' },
              license: 'https://github.com/Shineii86/ShineiAPI/blob/main/LICENSE',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              featureList: ['Full-text search', 'Series metadata', 'Chapter tracking', 'CORS enabled', 'No authentication'],
            }),
          }}
        />
      </head>
      <body className="bg-surface text-primary font-sans antialiased">
        <ScrollProgress />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
