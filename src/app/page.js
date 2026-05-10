/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Landing Page — Server Component (metadata)          ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import HomeContent from './HomeContent';

export const metadata = {
  title: 'ShineiAPI — Free Manga & Manhwa REST API',
  description:
    'Search thousands of manga and manhwa series. Get chapters, ratings, cover art. No API key. No signup. Just build.',
  openGraph: {
    title: 'ShineiAPI — Free Manga & Manhwa REST API',
    description:
      'Search thousands of manga and manhwa series. Get chapters, ratings, cover art. No API key. No signup. Just build.',
    url: 'https://shineiapi.vercel.app',
  },
};

export default function HomePage() {
  return <HomeContent />;
}
