/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Browse — Live Manhwa Website Showcase               ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import BrowseContent from './BrowseContent';

export const metadata = {
  title: 'Browse Manga & Manhwa',
  description:
    'Discover manga, manhwa, and webtoons powered by ShineiAPI. Browse popular series, search by title, explore genres, and read chapter details — all in a beautiful manhwa-style interface.',
  openGraph: {
    title: 'Browse Manga & Manhwa | ShineiAPI',
    description:
      'Discover manga, manhwa, and webtoons powered by ShineiAPI. Browse, search, and explore series in a beautiful manhwa-style interface.',
  },
};

export default function BrowsePage() {
  return <BrowseContent />;
}
